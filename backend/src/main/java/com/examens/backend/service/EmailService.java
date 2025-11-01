package com.examens.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.email.from}")
    private String fromEmail;

    @Value("${app.email.name}")
    private String fromName;

    public void sendPaymentConfirmationEmail(String toEmail, String studentName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, fromName);
            helper.setTo(toEmail);
            helper.setSubject("✅ Votre compte SmartBac a été activé !");

            String htmlContent = buildPaymentConfirmationEmail(studentName);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            logger.info("Confirmation email sent successfully to: {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send confirmation email to: {}", toEmail, e);
            throw new RuntimeException("Erreur lors de l'envoi de l'email: " + e.getMessage());
        }
    }

    public void sendWelcomeEmail(String toEmail, String studentName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, fromName);
            helper.setTo(toEmail);
            helper.setSubject("🎓 Bienvenue sur SmartBac Platform");

            String htmlContent = buildWelcomeEmail(studentName);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            logger.info("Welcome email sent successfully to: {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send welcome email to: {}", toEmail, e);
            // Don't throw exception for welcome email to not block registration
        }
    }

    private String buildPaymentConfirmationEmail(String studentName) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<meta charset='UTF-8'>" +
                "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "<style>" +
                "body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f3f4f6; }" +
                ".container { max-width: 600px; margin: 20px auto; background-color: #ffffff; }" +
                ".header { background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }" +
                ".success-icon { font-size: 48px; margin-bottom: 10px; }" +
                ".content { padding: 30px; }" +
                ".button { display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%); color: white !important; padding: 14px 32px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }" +
                ".info-box { background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 16px; margin: 20px 0; border-radius: 5px; }" +
                ".footer { text-align: center; padding: 20px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }" +
                "ul { padding-left: 20px; }" +
                "li { margin: 10px 0; }" +
                "h1 { margin: 0; font-size: 28px; }" +
                "p { margin: 10px 0; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<div class='success-icon'>✅</div>" +
                "<h1>Paiement Vérifié !</h1>" +
                "<p style='margin: 10px 0 0 0; font-size: 16px;'>Bienvenue sur SmartBac Platform</p>" +
                "</div>" +
                "<div class='content'>" +
                "<p>Bonjour <strong>" + studentName + "</strong>,</p>" +
                "<p>Nous avons le plaisir de vous informer que votre paiement a été vérifié avec succès ! 🎉</p>" +
                "<div class='info-box'>" +
                "<strong>🎓 Votre compte est maintenant actif</strong><br>" +
                "Vous pouvez dès maintenant accéder à tous nos contenus et commencer votre préparation pour le Bac 2026." +
                "</div>" +
                "<p><strong>Ce qui vous attend :</strong></p>" +
                "<ul>" +
                "<li>📚 Accès illimité aux examens régionaux</li>" +
                "<li>📝 Questions corrigées et détaillées</li>" +
                "<li>💡 QCM par chapitre pour tester vos connaissances</li>" +
                "<li>📊 Suivi de votre progression</li>" +
                "<li>🎯 Préparation complète pour le Bac</li>" +
                "</ul>" +
                "<div style='text-align: center;'>" +
                "<a href='http://localhost:3000' class='button'>Accéder à ma plateforme</a>" +
                "</div>" +
                "<div class='info-box'>" +
                "<strong>💡 Conseil :</strong> Connectez-vous avec l'email et le mot de passe que vous avez utilisés lors de votre inscription." +
                "</div>" +
                "<p>Si vous avez des questions ou besoin d'aide, n'hésitez pas à nous contacter via WhatsApp au <strong>+212 690 002 573</strong>.</p>" +
                "<p>Bonne chance dans votre préparation ! 💪</p>" +
                "<p style='margin-top: 30px;'>Cordialement,<br><strong>L'équipe SmartBac</strong></p>" +
                "</div>" +
                "<div class='footer'>" +
                "<p>© 2025 SmartBac Platform - Tous droits réservés</p>" +
                "<p style='font-size: 12px; margin-top: 10px;'>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }

    private String buildWelcomeEmail(String studentName) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<meta charset='UTF-8'>" +
                "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "<style>" +
                "body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f3f4f6; }" +
                ".container { max-width: 600px; margin: 20px auto; background-color: #ffffff; }" +
                ".header { background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }" +
                ".content { padding: 30px; }" +
                ".warning-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 20px 0; border-radius: 5px; }" +
                ".footer { text-align: center; padding: 20px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }" +
                "h1 { margin: 0; font-size: 28px; }" +
                "p { margin: 10px 0; }" +
                "ol { padding-left: 20px; }" +
                "li { margin: 10px 0; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<h1>🎓 Bienvenue !</h1>" +
                "<p style='margin: 10px 0 0 0;'>Votre inscription est en cours de traitement</p>" +
                "</div>" +
                "<div class='content'>" +
                "<p>Bonjour <strong>" + studentName + "</strong>,</p>" +
                "<p>Merci de votre inscription sur <strong>SmartBac Platform</strong> !</p>" +
                "<div class='warning-box'>" +
                "<strong>⏳ Compte en attente d'activation</strong><br>" +
                "Votre compte sera activé dès que nous aurons vérifié votre paiement. Cela prend généralement moins de 24 heures." +
                "</div>" +
                "<p><strong>Prochaines étapes :</strong></p>" +
                "<ol>" +
                "<li>Nous vérifions votre reçu de paiement</li>" +
                "<li>Vous recevrez un email de confirmation</li>" +
                "<li>Vous pourrez accéder à votre compte</li>" +
                "</ol>" +
                "<p>Si vous avez des questions, contactez-nous sur WhatsApp au <strong>+212 690 002 573</strong>.</p>" +
                "<p>À très bientôt sur la plateforme ! 🚀</p>" +
                "<p style='margin-top: 30px;'>Cordialement,<br><strong>L'équipe SmartBac</strong></p>" +
                "</div>" +
                "<div class='footer'>" +
                "<p>© 2025 SmartBac Platform - Tous droits réservés</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }
}