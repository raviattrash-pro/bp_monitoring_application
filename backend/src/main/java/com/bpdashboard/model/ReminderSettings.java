package com.bpdashboard.model;

import jakarta.persistence.*;

@Entity
@Table(name = "reminder_settings")
public class ReminderSettings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 20)
    private String phoneNumber;

    @Column(length = 5)
    private String morningTime;

    @Column(length = 5)
    private String nightTime;

    @Column(nullable = false)
    private Boolean enabled = false;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    public ReminderSettings() {
    }

    public ReminderSettings(Long id, String phoneNumber, String morningTime, String nightTime, Boolean enabled,
            User user) {
        this.id = id;
        this.phoneNumber = phoneNumber;
        this.morningTime = morningTime;
        this.nightTime = nightTime;
        this.enabled = enabled != null ? enabled : false;
        this.user = user;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getMorningTime() {
        return morningTime;
    }

    public void setMorningTime(String morningTime) {
        this.morningTime = morningTime;
    }

    public String getNightTime() {
        return nightTime;
    }

    public void setNightTime(String nightTime) {
        this.nightTime = nightTime;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    // Manual Builder
    public static ReminderSettingsBuilder builder() {
        return new ReminderSettingsBuilder();
    }

    public static class ReminderSettingsBuilder {
        private Long id;
        private String phoneNumber;
        private String morningTime;
        private String nightTime;
        private Boolean enabled;
        private User user;

        public ReminderSettingsBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public ReminderSettingsBuilder phoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
            return this;
        }

        public ReminderSettingsBuilder morningTime(String morningTime) {
            this.morningTime = morningTime;
            return this;
        }

        public ReminderSettingsBuilder nightTime(String nightTime) {
            this.nightTime = nightTime;
            return this;
        }

        public ReminderSettingsBuilder enabled(Boolean enabled) {
            this.enabled = enabled;
            return this;
        }

        public ReminderSettingsBuilder user(User user) {
            this.user = user;
            return this;
        }

        public ReminderSettings build() {
            return new ReminderSettings(id, phoneNumber, morningTime, nightTime, enabled, user);
        }
    }
}
