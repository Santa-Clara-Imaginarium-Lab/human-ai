import { SignUp } from '@clerk/clerk-react'
import './signUpPage.css'

const SignUpPage = () => {
    return (
        <div className="signUpPage">
      <SignUp path="/sign-up" signInUrl="sign-in"/>
    </div>
    )
}
export default SignUpPage

// This component shows a sign-up form for users to create an account. It uses the Clerk
//  library to handle the sign-up logic and routes users to the sign-in page if needed. The component is styled by the 
//  associated CSS file.