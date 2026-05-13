package com.bpdashboard.dto;

import jakarta.validation.constraints.Size;

public class EmergencyProfileRequest {
    @Size(max = 10)
    private String bloodGroup;
    @Size(max = 1200)
    private String allergies;
    @Size(max = 1200)
    private String chronicConditions;
    @Size(max = 120)
    private String contactName;
    @Size(max = 40)
    private String contactPhone;
    @Size(max = 80)
    private String contactRelation;
    @Size(max = 120)
    private String insuranceProvider;
    @Size(max = 80)
    private String insurancePolicyNumber;
    @Size(max = 120)
    private String doctorName;
    @Size(max = 40)
    private String doctorPhone;
    @Size(max = 1200)
    private String notes;

    public EmergencyProfileRequest() {
    }
    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }
    public String getAllergies() { return allergies; }
    public void setAllergies(String allergies) { this.allergies = allergies; }
    public String getChronicConditions() { return chronicConditions; }
    public void setChronicConditions(String chronicConditions) { this.chronicConditions = chronicConditions; }
    public String getContactName() { return contactName; }
    public void setContactName(String contactName) { this.contactName = contactName; }
    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
    public String getContactRelation() { return contactRelation; }
    public void setContactRelation(String contactRelation) { this.contactRelation = contactRelation; }
    public String getInsuranceProvider() { return insuranceProvider; }
    public void setInsuranceProvider(String insuranceProvider) { this.insuranceProvider = insuranceProvider; }
    public String getInsurancePolicyNumber() { return insurancePolicyNumber; }
    public void setInsurancePolicyNumber(String insurancePolicyNumber) { this.insurancePolicyNumber = insurancePolicyNumber; }
    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }
    public String getDoctorPhone() { return doctorPhone; }
    public void setDoctorPhone(String doctorPhone) { this.doctorPhone = doctorPhone; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
