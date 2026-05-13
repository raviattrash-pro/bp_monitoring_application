package com.bpdashboard.model;

import jakarta.persistence.*;

@Entity
@Table(name = "emergency_profiles")
public class EmergencyProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "blood_group", length = 10)
    private String bloodGroup;

    @Column(length = 1200)
    private String allergies;

    @Column(name = "chronic_conditions", length = 1200)
    private String chronicConditions;

    @Column(name = "contact_name", length = 120)
    private String contactName;

    @Column(name = "contact_phone", length = 40)
    private String contactPhone;

    @Column(name = "contact_relation", length = 80)
    private String contactRelation;

    @Column(name = "insurance_provider", length = 120)
    private String insuranceProvider;

    @Column(name = "insurance_policy_number", length = 80)
    private String insurancePolicyNumber;

    @Column(name = "doctor_name", length = 120)
    private String doctorName;

    @Column(name = "doctor_phone", length = 40)
    private String doctorPhone;

    @Column(length = 1200)
    private String notes;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    public EmergencyProfile() {
    }

    public EmergencyProfile(Long id, String bloodGroup, String allergies, String chronicConditions, String contactName,
            String contactPhone, String contactRelation, String insuranceProvider, String insurancePolicyNumber,
            String doctorName, String doctorPhone, String notes, User user) {
        this.id = id;
        this.bloodGroup = bloodGroup;
        this.allergies = allergies;
        this.chronicConditions = chronicConditions;
        this.contactName = contactName;
        this.contactPhone = contactPhone;
        this.contactRelation = contactRelation;
        this.insuranceProvider = insuranceProvider;
        this.insurancePolicyNumber = insurancePolicyNumber;
        this.doctorName = doctorName;
        this.doctorPhone = doctorPhone;
        this.notes = notes;
        this.user = user;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
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
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public static EmergencyProfileBuilder builder() { return new EmergencyProfileBuilder(); }

    public static class EmergencyProfileBuilder {
        private Long id;
        private String bloodGroup;
        private String allergies;
        private String chronicConditions;
        private String contactName;
        private String contactPhone;
        private String contactRelation;
        private String insuranceProvider;
        private String insurancePolicyNumber;
        private String doctorName;
        private String doctorPhone;
        private String notes;
        private User user;

        public EmergencyProfileBuilder id(Long id) { this.id = id; return this; }
        public EmergencyProfileBuilder bloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; return this; }
        public EmergencyProfileBuilder allergies(String allergies) { this.allergies = allergies; return this; }
        public EmergencyProfileBuilder chronicConditions(String chronicConditions) { this.chronicConditions = chronicConditions; return this; }
        public EmergencyProfileBuilder contactName(String contactName) { this.contactName = contactName; return this; }
        public EmergencyProfileBuilder contactPhone(String contactPhone) { this.contactPhone = contactPhone; return this; }
        public EmergencyProfileBuilder contactRelation(String contactRelation) { this.contactRelation = contactRelation; return this; }
        public EmergencyProfileBuilder insuranceProvider(String insuranceProvider) { this.insuranceProvider = insuranceProvider; return this; }
        public EmergencyProfileBuilder insurancePolicyNumber(String insurancePolicyNumber) { this.insurancePolicyNumber = insurancePolicyNumber; return this; }
        public EmergencyProfileBuilder doctorName(String doctorName) { this.doctorName = doctorName; return this; }
        public EmergencyProfileBuilder doctorPhone(String doctorPhone) { this.doctorPhone = doctorPhone; return this; }
        public EmergencyProfileBuilder notes(String notes) { this.notes = notes; return this; }
        public EmergencyProfileBuilder user(User user) { this.user = user; return this; }

        public EmergencyProfile build() {
            return new EmergencyProfile(id, bloodGroup, allergies, chronicConditions, contactName, contactPhone,
                    contactRelation, insuranceProvider, insurancePolicyNumber, doctorName, doctorPhone, notes, user);
        }
    }
}
