# 📧 Email Configuration Guide

This guide explains how to set up email notifications for order confirmations in your NIVARA application.

## 🚀 Quick Setup

### Development Mode (Default)
By default, the application runs in development mode where emails are logged to the console instead of being sent. This is perfect for testing and development.

### Production Setup

To enable real email sending, you need to configure an email provider:

#### Option 1: Resend.com (Recommended)
1. Sign up at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Set environment variables:
   ```bash
   REACT_APP_EMAIL_PROVIDER=resend
   REACT_APP_RESEND_API_KEY=your_api_key_here
   ```

#### Option 2: SendGrid
1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Create an API key
3. Set environment variables:
   ```bash
   REACT_APP_EMAIL_PROVIDER=sendgrid
   REACT_APP_SENDGRID_API_KEY=your_api_key_here
   ```

#### Option 3: Supabase Edge Functions
1. Create a Supabase Edge Function for email sending
2. Set environment variables:
   ```bash
   REACT_APP_EMAIL_PROVIDER=supabase
   ```

## 📧 Email Template Features

The order confirmation email includes:

- **Professional Design**: Beautiful HTML template with NIVARA branding
- **Order Details**: Complete order information and tracking
- **Shipping Information**: Delivery address and timeline
- **Next Steps**: Clear instructions for the customer
- **Support Information**: Contact details for assistance
- **Dashboard Link**: Direct link to user dashboard

## 🛠️ Customization

### Email Template
Edit `src/services/emailService.ts` to customize:
- Email styling and colors
- Company branding
- Additional information
- Call-to-action buttons

### Email Content
Modify the email content in the `sendOrderConfirmationEmail` function to include:
- Company-specific information
- Additional product details
- Special offers or promotions
- Social media links

## 🧪 Testing

### Development Testing
1. Place a test order
2. Check browser console for email logs
3. Verify email content and formatting

### Production Testing
1. Configure email provider
2. Test with real email addresses
3. Verify email delivery and formatting

## 🔧 Troubleshooting

### Common Issues

1. **Emails not sending**
   - Check API key configuration
   - Verify email provider settings
   - Check browser console for errors

2. **Email formatting issues**
   - Test HTML template in email client
   - Verify CSS compatibility
   - Check for broken links

3. **Rate limiting**
   - Check email provider limits
   - Implement queuing if needed
   - Monitor usage and costs

## 📊 Monitoring

### Email Analytics
- Track email open rates
- Monitor delivery success
- Analyze user engagement

### Error Handling
- Log failed email attempts
- Implement retry logic
- Alert on critical failures

## 🚀 Production Deployment

1. **Environment Variables**
   ```bash
   # Set in your deployment platform
   REACT_APP_EMAIL_PROVIDER=resend
   REACT_APP_RESEND_API_KEY=your_production_key
   ```

2. **Domain Configuration**
   - Set up custom domain for emails
   - Configure SPF/DKIM records
   - Verify domain with email provider

3. **Monitoring Setup**
   - Set up email delivery monitoring
   - Configure error alerts
   - Track email performance

## 📞 Support

For email-related issues:
- Check email provider documentation
- Review application logs
- Test with different email providers
- Contact support team for assistance

---

**Note**: Always test email functionality thoroughly before deploying to production!
