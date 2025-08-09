import { NextRequest, NextResponse } from 'next/server'
import { DataService } from '@/lib/dataService'
import { generateEmailVerificationPin, generateVerificationId, createPinExpiry, isValidEmail } from '@/lib/auth'
import { sendEmailVerificationPin } from '@/lib/email'

const dataService = new DataService()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, spaceData, pin } = body

    if (pin) {
      // Verify PIN
      if (!email || !pin) {
        return NextResponse.json(
          { error: 'Email and PIN are required' },
          { status: 400 }
        )
      }

      // Find the verification record
      const verification = await dataService.getEmailVerification(email, pin)
      if (!verification) {
        return NextResponse.json(
          { error: 'Invalid or expired PIN' },
          { status: 400 }
        )
      }

      // Mark as verified
      await dataService.markEmailVerified(verification.id)

      return NextResponse.json({ 
        success: true,
        message: 'Email verified successfully',
        spaceData: verification.space_data ? JSON.parse(verification.space_data) : null
      })
    } else {
      // Send PIN
      if (!email) {
        return NextResponse.json(
          { error: 'Email is required' },
          { status: 400 }
        )
      }

      if (!isValidEmail(email)) {
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        )
      }

      // Check if user already exists
      const existingUser = await dataService.getGlobalUserByEmail(email)
      if (existingUser) {
        return NextResponse.json(
          { error: 'User already exists with this email' },
          { status: 409 }
        )
      }

      // Generate PIN and create verification record
      const pin = generateEmailVerificationPin()
      const verificationId = generateVerificationId()
      
      await dataService.createEmailVerification({
        id: verificationId,
        email,
        pin,
        expires_at: createPinExpiry(15), // 15 minutes
        verified: false,
        space_data: spaceData ? JSON.stringify(spaceData) : undefined
      })

      // Send email with PIN
      const spaceId = spaceData?.id || 'your-space'
      await sendEmailVerificationPin(email, pin, spaceId)

      return NextResponse.json({ 
        success: true,
        message: 'Verification PIN sent to your email'
      })
    }
  } catch (error) {
    console.error('Error in email verification:', error)
    return NextResponse.json(
      { error: 'Email verification failed' },
      { status: 500 }
    )
  }
}