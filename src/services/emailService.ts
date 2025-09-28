import { supabase } from '@/integrations/supabase/client';
import { getEmailProvider } from './emailProviders';

interface OrderConfirmationData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  quantity: number;
  shippingAddress: string;
  orderDate: string;
}

export const sendOrderConfirmationEmail = async (orderData: OrderConfirmationData) => {
  try {
    // Create a professional HTML email template
    const emailHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - NIVARA</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
          }
          .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
          }
          .content {
            background: white;
            padding: 30px;
            border-radius: 0 0 10px 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .order-details {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #667eea;
          }
          .order-details h3 {
            margin: 0 0 15px 0;
            color: #667eea;
            font-size: 18px;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            padding: 8px 0;
            border-bottom: 1px solid #e2e8f0;
          }
          .detail-row:last-child {
            border-bottom: none;
            font-weight: bold;
            font-size: 16px;
            color: #667eea;
          }
          .shipping-info {
            background: #f0f9ff;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #0ea5e9;
          }
          .shipping-info h3 {
            margin: 0 0 15px 0;
            color: #0ea5e9;
            font-size: 18px;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            color: #64748b;
            font-size: 14px;
          }
          .highlight {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎉 Order Confirmed!</h1>
          <p>Thank you for choosing NIVARA</p>
        </div>
        
        <div class="content">
          <p>Dear <strong>${orderData.customerName}</strong>,</p>
          
          <p>We're excited to confirm that your NIVARA order has been successfully placed! Your smart skin health scanner is on its way to revolutionize your healthcare journey.</p>
          
          <div class="order-details">
            <h3>📋 Order Details</h3>
            <div class="detail-row">
              <span>Order ID:</span>
              <span><strong>${orderData.orderId}</strong></span>
            </div>
            <div class="detail-row">
              <span>Order Date:</span>
              <span>${orderData.orderDate}</span>
            </div>
            <div class="detail-row">
              <span>Quantity:</span>
              <span>${orderData.quantity} NIVARA Device(s)</span>
            </div>
            <div class="detail-row">
              <span>Total Amount:</span>
              <span><strong>₹${orderData.totalAmount.toLocaleString()}</strong></span>
            </div>
          </div>
          
          <div class="shipping-info">
            <h3>🚚 Shipping Information</h3>
            <p><strong>Delivery Address:</strong></p>
            <p>${orderData.shippingAddress}</p>
          </div>
          
          <h3>What's Next?</h3>
          <ul>
            <li>📦 <strong>Processing:</strong> Your order is being prepared for shipment</li>
            <li>🚚 <strong>Shipping:</strong> You'll receive tracking information via email</li>
            <li>📱 <strong>Setup:</strong> Follow our quick setup guide when your device arrives</li>
            <li>🏥 <strong>Support:</strong> Our team is here to help with any questions</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${window.location.origin}/dashboard" class="cta-button">
              View Your Dashboard
            </a>
          </div>
          
          <p>If you have any questions about your order, please don't hesitate to contact our support team at <strong>support@nivara.com</strong> or call us at <strong>+91-XXXX-XXXX</strong>.</p>
          
          <p>Thank you for trusting NIVARA with your skin health journey!</p>
          
          <p>Best regards,<br>
          <strong>The NIVARA Team</strong></p>
        </div>
        
        <div class="footer">
          <p>© 2024 NIVARA. All rights reserved.</p>
          <p>This email was sent to ${orderData.customerEmail}</p>
        </div>
      </body>
      </html>
    `;

    const emailPayload = {
      to: orderData.customerEmail,
      subject: `🎉 Order Confirmed - NIVARA Device (Order #${orderData.orderId})`,
      html: emailHtml,
      orderData: orderData
    };

    // Get the appropriate email provider based on environment
    const emailProvider = getEmailProvider();
    
    if (emailProvider) {
      // Use configured email provider (Resend, SendGrid, etc.)
      const result = await emailProvider(emailPayload);
      return result;
    } else {
      // Development mode - log email details
      console.log('📧 [DEV MODE] Email would be sent with data:', {
        to: emailPayload.to,
        subject: emailPayload.subject,
        orderId: orderData.orderId,
        customerName: orderData.customerName,
        totalAmount: orderData.totalAmount
      });
      
      // Simulate successful email sending in development
      return { success: true, message: 'Order confirmation email logged (development mode)' };
    }
    
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return { success: false, message: 'Failed to send confirmation email' };
  }
};

export const sendOrderConfirmationEmailViaSupabase = async (orderData: OrderConfirmationData) => {
  try {
    // This would use Supabase Edge Functions to send emails
    // You would need to create an Edge Function that handles email sending
    const { data, error } = await supabase.functions.invoke('send-order-email', {
      body: {
        to: orderData.customerEmail,
        subject: `🎉 Order Confirmed - NIVARA Device (Order #${orderData.orderId})`,
        orderData: orderData
      }
    });

    if (error) throw error;
    return { success: true, message: 'Order confirmation email sent successfully' };
  } catch (error) {
    console.error('Error sending email via Supabase:', error);
    return { success: false, message: 'Failed to send confirmation email' };
  }
};
