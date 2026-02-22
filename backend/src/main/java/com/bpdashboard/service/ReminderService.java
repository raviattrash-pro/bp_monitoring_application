package com.bpdashboard.service;

import com.bpdashboard.model.ReminderSettings;
import com.bpdashboard.repository.ReminderRepository;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.annotation.PostConstruct;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.logging.Logger;

@Service
public class ReminderService {

    private static final Logger logger = Logger.getLogger(ReminderService.class.getName());
    private final ReminderRepository reminderRepository;

    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @Value("${twilio.whatsapp.number}")
    private String twilioNumber;

    @Value("${FRONTEND_URL:http://localhost:5173}")
    private String frontendUrl;

    @Autowired
    public ReminderService(ReminderRepository reminderRepository) {
        this.reminderRepository = reminderRepository;
    }

    @PostConstruct
    public void init() {
        if (!accountSid.startsWith("AC")) {
            logger.warning("Twilio Account SID is not set of invalid. Real WhatsApp reminders will fail.");
        } else {
            Twilio.init(accountSid, authToken);
            logger.info("Twilio initialized for automated WhatsApp reminders.");
        }
    }

    /**
     * Checks for scheduled reminders every minute.
     */
    @Scheduled(cron = "0 * * * * *") // Every minute
    @Transactional(readOnly = true)
    public void processReminders() {
        LocalTime now = LocalTime.now();
        String currentTime = now.format(DateTimeFormatter.ofPattern("HH:mm"));

        List<ReminderSettings> allSettings = reminderRepository.findAll();

        for (ReminderSettings settings : allSettings) {
            if (settings.getEnabled() != null && settings.getEnabled()) {
                if (currentTime.equals(settings.getMorningTime())) {
                    sendReminder(settings, "morning");
                } else if (currentTime.equals(settings.getNightTime())) {
                    sendReminder(settings, "night");
                }
            }
        }
    }

    private void sendReminder(ReminderSettings settings, String period) {
        String phone = settings.getPhoneNumber();
        String name = settings.getUser().getName();

        // Ensure phone starts with '+' for Twilio
        if (!phone.startsWith("+")) {
            phone = "+" + phone;
        }

        String messageContent = String.format(
                "🩺 BP Reminder for %s: Time to take your %s blood pressure reading! Log it here: %s",
                name, period, frontendUrl);

        try {
            String fromNumber = "whatsapp:" + twilioNumber.trim();
            String toNumber = "whatsapp:" + phone.trim();

            logger.info("Attempting to send WhatsApp from: " + fromNumber + " to: " + toNumber);

            if (accountSid.startsWith("AC")) {
                Message message = Message.creator(
                        new PhoneNumber(toNumber),
                        new PhoneNumber(fromNumber),
                        messageContent)
                        .create();
                logger.info("WhatsApp reminder sent successfully! Message SID: " + message.getSid());
            } else {
                logger.info("[TWILIO SIMULATION] Skipping real send (Invalid SID). Message: " + messageContent);
            }
        } catch (Exception e) {
            logger.severe("FAILED to send WhatsApp message. Error: " + e.getMessage());
            logger.severe("Check if your Twilio Sandbox number is exactly: " + twilioNumber);
        }
    }
}
