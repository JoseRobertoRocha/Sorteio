package com.conecta.sorteio_api.model;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

import com.conecta.sorteio_api.enuns.Role;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;
    private String numberCell;
    private String email;
    private String keyPix;
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int sweepstakeQuantity;

    // Construtor padrão exigido pelo JPA
    public User() {}

    // Construtor usado pelo Builder
    private User(String name, String numberCell, String email, String keyPix, String password, Role role) {
        this.name = name;
        this.numberCell = numberCell;
        this.email = email;
        this.keyPix = keyPix;
        this.password = password;
        this.role = role;
    }

    public void setRole(Role role){
        this.role = role;
    }

    // Getters
    public UUID getId() { return id; }
    public String getName() { return name; }
    public String getNumberCell() { return numberCell; }
    public String getEmail() { return email; }
    public String getKeyPix() { return keyPix; }
    public String getPassword() { return password; }
    public Role getRole() { return role; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public int getSweepstakeQuantity() { return sweepstakeQuantity; }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Builder
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String name;
        private String numberCell;
        private String email;
        private String keyPix;
        private String password;
        private Role role;

        public Builder name(String name) { this.name = name; return this; }
        public Builder numberCell(String numberCell) { this.numberCell = numberCell; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder keyPix(String keyPix) { this.keyPix = keyPix; return this; }
        public Builder password(String password) { this.password = password; return this; }
        public Builder role(Role role) { this.role = role; return this; }

        public User build() {
            return new User(name, numberCell, email, keyPix, password, role);
        }
    }

    // equals e hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User)) return false;
        User user = (User) o;
        return Objects.equals(id, user.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
