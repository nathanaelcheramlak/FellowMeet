const generateEmailTemplate = (emailType, link) => {
    // Common styles for the email
    const styles = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px 0; }
        .logo { max-width: 150px; height: auto; }
        .content { background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); }
        .button { display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white !important; text-decoration: none; border-radius: 6px; font-weight: 500; margin: 20px 0; }
        .footer { text-align: center; padding: 20px 0; color: #6b7280; font-size: 14px; }
        .divider { height: 1px; background-color: #e5e7eb; margin: 20px 0; }
      </style>
    `;
  
    // Determine content based on email type
    let title, description, buttonText;
    
    switch(emailType) {
      case 'verification':
        title = 'Verify Your Email Address';
        description = 'Thank you for signing up! Please verify your email address by clicking the button below.';
        buttonText = 'Verify Email';
        break;
      case 'reset':
        title = 'Reset Your Password';
        description = 'You requested to reset your password. Click the button below to proceed. This link will expire in 1 hour.';
        buttonText = 'Reset Password';
        break;
      case 'welcome':
        title = 'Welcome to Our Platform!';
        description = 'Thank you for joining us! Get started by exploring our platform.';
        buttonText = 'Get Started';
        break;
      default:
        title = 'Action Required';
        description = 'Please click the button below to complete your request.';
        buttonText = 'Take Action';
    }
  
    // Construct the HTML email
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        ${styles}
      </head>
      <body>
        <div class="container">
          <div class="header">
            <!-- Replace with your actual logo -->
            <img src="https://via.placeholder.com/150x50?text=Your+Logo" alt="Company Logo" class="logo">
          </div>
          
          <div class="content">
            <h2 style="color: #111827; margin-top: 0;">${title}</h2>
            <p>${description}</p>
            
            <div style="text-align: center;">
              <a href="${link}" class="button">${buttonText}</a>
            </div>
            
            <p style="font-size: 14px; color: #6b7280;">
              If you didn't request this email, you can safely ignore it.
            </p>
            
            <div class="divider"></div>
            
            <p style="margin-bottom: 0;">If the button above doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; font-size: 14px; color: #6b7280;">${link}</p>
          </div>
          
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
            <p>
              <a href="#" style="color: #6b7280; text-decoration: none;">Help Center</a> | 
              <a href="#" style="color: #6b7280; text-decoration: none;">Privacy Policy</a> | 
              <a href="#" style="color: #6b7280; text-decoration: none;">Terms of Service</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  };
  
  export default generateEmailTemplate;