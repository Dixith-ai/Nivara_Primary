// Email provider integrations for production use

// Resend.com integration
export const sendEmailViaResend = async (emailData: {
  to: string;
  subject: string;
  html: string;
}) => {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'NIVARA <noreply@nivara.com>',
        to: [emailData.to],
        subject: emailData.subject,
        html: emailData.html,
      }),
    });

    if (!response.ok) {
      throw new Error(`Resend API error: ${response.status}`);
    }

    const result = await response.json();
    return { success: true, messageId: result.id };
  } catch (error) {
    console.error('Resend email error:', error);
    return { success: false, error: error.message };
  }
};

// SendGrid integration
export const sendEmailViaSendGrid = async (emailData: {
  to: string;
  subject: string;
  html: string;
}) => {
  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: emailData.to }],
          },
        ],
        from: { email: 'noreply@nivara.com', name: 'NIVARA' },
        subject: emailData.subject,
        content: [
          {
            type: 'text/html',
            value: emailData.html,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`SendGrid API error: ${response.status}`);
    }

    return { success: true, messageId: 'sendgrid-' + Date.now() };
  } catch (error) {
    console.error('SendGrid email error:', error);
    return { success: false, error: error.message };
  }
};

// Supabase Edge Function integration
export const sendEmailViaSupabaseFunction = async (emailData: {
  to: string;
  subject: string;
  html: string;
  orderData: any;
}) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-order-email', {
      body: {
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
        orderData: emailData.orderData,
      },
    });

    if (error) throw error;
    return { success: true, messageId: data.messageId };
  } catch (error) {
    console.error('Supabase function email error:', error);
    return { success: false, error: error.message };
  }
};

// Environment-based email provider selection
export const getEmailProvider = () => {
  const provider = process.env.REACT_APP_EMAIL_PROVIDER || 'console';
  
  switch (provider) {
    case 'resend':
      return sendEmailViaResend;
    case 'sendgrid':
      return sendEmailViaSendGrid;
    case 'supabase':
      return sendEmailViaSupabaseFunction;
    default:
      return null; // Will use console logging in development
  }
};
