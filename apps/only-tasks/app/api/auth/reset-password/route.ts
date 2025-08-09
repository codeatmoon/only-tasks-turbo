import { NextRequest, NextResponse } from 'next/server'
import { DataService } from '@/lib/dataService'
import { generateToken, generateTokenId, createTokenExpiry, hashPassword } from '@/lib/auth'
import { sendPasswordResetEmail } from '@/lib/email'

const dataService = new DataService()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, spaceId, token, newPassword } = body

    if (token && newPassword) {
      // Reset password with token
      const authToken = await dataService.getAuthToken(token)
      if (!authToken || authToken.type !== 'password_reset') {
        return NextResponse.json(
          { error: 'Invalid or expired reset token' },
          { status: 400 }
        )
      }

      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: 'Password must be at least 6 characters' },
          { status: 400 }
        )
      }

      // Update user password
      const passwordHash = await hashPassword(newPassword)
      await dataService.updateGlobalUser(authToken.user_id, {
        password_hash: passwordHash
      })

      // Mark token as used
      await dataService.markTokenUsed(authToken.id)

      return NextResponse.json({ success: true })
    } else if (email && spaceId) {
      // Send reset email
      const user = await dataService.getGlobalUserByEmail(email)
      if (!user) {
        // Don't reveal if user exists or not
        return NextResponse.json({ success: true })
      }

      // Generate reset token
      const resetToken = generateToken()
      const tokenId = generateTokenId()
      
      await dataService.createAuthToken({
        id: tokenId,
        user_id: user.id,
        token: resetToken,
        type: 'password_reset',
        expires_at: createTokenExpiry(24),
        used: false
      })

      // Send email
      await sendPasswordResetEmail(email, resetToken, spaceId)

      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { error: 'Either email+spaceId or token+newPassword required' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error in password reset:', error)
    return NextResponse.json(
      { error: 'Password reset failed' },
      { status: 500 }
    )
  }
}