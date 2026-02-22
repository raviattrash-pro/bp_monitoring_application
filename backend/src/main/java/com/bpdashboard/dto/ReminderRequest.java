package com.bpdashboard.dto;

public class ReminderRequest {
    private String phoneNumber;
    private String morningTime;
    private String nightTime;
    private Boolean enabled;

    public ReminderRequest() {
    }

    public ReminderRequest(String phoneNumber, String morningTime, String nightTime, Boolean enabled) {
        this.phoneNumber = phoneNumber;
        this.morningTime = morningTime;
        this.nightTime = nightTime;
        this.enabled = enabled;
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

    public static ReminderRequestBuilder builder() {
        return new ReminderRequestBuilder();
    }

    public static class ReminderRequestBuilder {
        private String phoneNumber;
        private String morningTime;
        private String nightTime;
        private Boolean enabled;

        public ReminderRequestBuilder phoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
            return this;
        }

        public ReminderRequestBuilder morningTime(String morningTime) {
            this.morningTime = morningTime;
            return this;
        }

        public ReminderRequestBuilder nightTime(String nightTime) {
            this.nightTime = nightTime;
            return this;
        }

        public ReminderRequestBuilder enabled(Boolean enabled) {
            this.enabled = enabled;
            return this;
        }

        public ReminderRequest build() {
            return new ReminderRequest(phoneNumber, morningTime, nightTime, enabled);
        }
    }
}
