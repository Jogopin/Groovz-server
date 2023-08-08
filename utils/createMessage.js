const createMessage = (orderUpdated) => {
 
  const message = `<body style="font-family: 'Arial', sans-serif; background-color: #f4f4f4; padding: 20px; color: #333;">
    <div style="max-width: 600px; background-color: #ffffff; border-radius: 5px; padding: 20px; margin: auto; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
        <p style="font-size: 18px;">Dear <strong style="color: #2c3e50;">${orderUpdated.firstName}</strong>,</p>
        
        <p>Thank you for trusting us! We are thrilled to confirm that your order, 
            <strong style="color: #2c3e50;">"${orderUpdated._id}"</strong>, has been received and is being processed.</p>
        
        <p>We are excited to get your order to you as soon as possible and will keep you updated on the status of your shipment. 
            If you have any questions or concerns, please don’t hesitate to contact us.</p>
        
        <p>Thank you again for your support. Happy shopping!</p>
        
        <p>Warm Regards,</p>
        
        <p style="font-size: 18px;"><strong>Team Groovz</strong></p>
    </div>
</body>`;

  return message;
};

module.exports = { createMessage };
