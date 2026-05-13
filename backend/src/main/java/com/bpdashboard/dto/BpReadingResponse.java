package com.bpdashboard.dto;

public class BpReadingResponse {
    private Long id;
    private Integer systolic;
    private Integer diastolic;
    private Integer heartRate;
    private Integer bloodSugar;
    private Integer oxygenSaturation;
    private Double bodyTemperature;
    private Double weightKg;
    private String notes;
    private String symptoms;
    private String timeOfDay;
    private String readingDate;

    public BpReadingResponse() {
    }

    public BpReadingResponse(Long id, Integer systolic, Integer diastolic, Integer heartRate, Integer bloodSugar,
            Integer oxygenSaturation, Double bodyTemperature, Double weightKg, String notes, String symptoms, String timeOfDay,
            String readingDate) {
        this.id = id;
        this.systolic = systolic;
        this.diastolic = diastolic;
        this.heartRate = heartRate;
        this.bloodSugar = bloodSugar;
        this.oxygenSaturation = oxygenSaturation;
        this.bodyTemperature = bodyTemperature;
        this.weightKg = weightKg;
        this.notes = notes;
        this.symptoms = symptoms;
        this.timeOfDay = timeOfDay;
        this.readingDate = readingDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getSystolic() {
        return systolic;
    }

    public void setSystolic(Integer systolic) {
        this.systolic = systolic;
    }

    public Integer getDiastolic() {
        return diastolic;
    }

    public void setDiastolic(Integer diastolic) {
        this.diastolic = diastolic;
    }

    public Integer getHeartRate() {
        return heartRate;
    }

    public void setHeartRate(Integer heartRate) {
        this.heartRate = heartRate;
    }

    public Integer getBloodSugar() {
        return bloodSugar;
    }

    public void setBloodSugar(Integer bloodSugar) {
        this.bloodSugar = bloodSugar;
    }

    public Integer getOxygenSaturation() {
        return oxygenSaturation;
    }

    public void setOxygenSaturation(Integer oxygenSaturation) {
        this.oxygenSaturation = oxygenSaturation;
    }

    public Double getBodyTemperature() {
        return bodyTemperature;
    }

    public void setBodyTemperature(Double bodyTemperature) {
        this.bodyTemperature = bodyTemperature;
    }

    public Double getWeightKg() {
        return weightKg;
    }

    public void setWeightKg(Double weightKg) {
        this.weightKg = weightKg;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getSymptoms() {
        return symptoms;
    }

    public void setSymptoms(String symptoms) {
        this.symptoms = symptoms;
    }

    public String getTimeOfDay() {
        return timeOfDay;
    }

    public void setTimeOfDay(String timeOfDay) {
        this.timeOfDay = timeOfDay;
    }

    public String getReadingDate() {
        return readingDate;
    }

    public void setReadingDate(String readingDate) {
        this.readingDate = readingDate;
    }

    public static BpReadingResponseBuilder builder() {
        return new BpReadingResponseBuilder();
    }

    public static class BpReadingResponseBuilder {
        private Long id;
        private Integer systolic;
        private Integer diastolic;
        private Integer heartRate;
        private Integer bloodSugar;
        private Integer oxygenSaturation;
        private Double bodyTemperature;
        private Double weightKg;
        private String notes;
        private String symptoms;
        private String timeOfDay;
        private String readingDate;

        public BpReadingResponseBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public BpReadingResponseBuilder systolic(Integer systolic) {
            this.systolic = systolic;
            return this;
        }

        public BpReadingResponseBuilder diastolic(Integer diastolic) {
            this.diastolic = diastolic;
            return this;
        }

        public BpReadingResponseBuilder heartRate(Integer heartRate) {
            this.heartRate = heartRate;
            return this;
        }

        public BpReadingResponseBuilder bloodSugar(Integer bloodSugar) {
            this.bloodSugar = bloodSugar;
            return this;
        }

        public BpReadingResponseBuilder oxygenSaturation(Integer oxygenSaturation) {
            this.oxygenSaturation = oxygenSaturation;
            return this;
        }

        public BpReadingResponseBuilder bodyTemperature(Double bodyTemperature) {
            this.bodyTemperature = bodyTemperature;
            return this;
        }

        public BpReadingResponseBuilder weightKg(Double weightKg) {
            this.weightKg = weightKg;
            return this;
        }

        public BpReadingResponseBuilder notes(String notes) {
            this.notes = notes;
            return this;
        }

        public BpReadingResponseBuilder symptoms(String symptoms) {
            this.symptoms = symptoms;
            return this;
        }

        public BpReadingResponseBuilder timeOfDay(String timeOfDay) {
            this.timeOfDay = timeOfDay;
            return this;
        }

        public BpReadingResponseBuilder readingDate(String readingDate) {
            this.readingDate = readingDate;
            return this;
        }

        public BpReadingResponse build() {
            return new BpReadingResponse(id, systolic, diastolic, heartRate, bloodSugar, oxygenSaturation,
                    bodyTemperature, weightKg, notes, symptoms, timeOfDay, readingDate);
        }
    }
}
