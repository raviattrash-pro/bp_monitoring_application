package com.bpdashboard.dto;

public class BpReadingResponse {
    private Long id;
    private Integer systolic;
    private Integer diastolic;
    private String timeOfDay;
    private String readingDate;

    public BpReadingResponse() {
    }

    public BpReadingResponse(Long id, Integer systolic, Integer diastolic, String timeOfDay, String readingDate) {
        this.id = id;
        this.systolic = systolic;
        this.diastolic = diastolic;
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

        public BpReadingResponseBuilder timeOfDay(String timeOfDay) {
            this.timeOfDay = timeOfDay;
            return this;
        }

        public BpReadingResponseBuilder readingDate(String readingDate) {
            this.readingDate = readingDate;
            return this;
        }

        public BpReadingResponse build() {
            return new BpReadingResponse(id, systolic, diastolic, timeOfDay, readingDate);
        }
    }
}
