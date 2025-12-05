package com.conecta.sorteio_api.model;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_bet")
public class Bet {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    private User user;

    @Column(columnDefinition = "integer[]")
    private int[] sweepstakeNumber;

    @ManyToOne
    private Sweepstake sweepstake;

    private LocalDateTime createAt;
    private LocalDateTime updateAt;

  
    public Bet() {}

    
    private Bet(User user, int[] sweepstakeNumber, Sweepstake sweepstake) {
        this.user = user;
        this.sweepstakeNumber = sweepstakeNumber;
        this.sweepstake = sweepstake;
    }

    public UUID getId() { return id; }
    public User getUser() { return user; }
    public int[] getSweepstakeNumber() { return sweepstakeNumber; }
    public Sweepstake getSweepstake() { return sweepstake; }
    public LocalDateTime getCreateAt() { return createAt; }
    public LocalDateTime getUpdateAt() { return updateAt; }

    @PrePersist
    protected void onCreate() { createAt = LocalDateTime.now(); }

    @PreUpdate
    protected void onUpdate() { updateAt = LocalDateTime.now(); }

 
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private User user;
        private int[] sweepstakeNumber;
        private Sweepstake sweepstake;

        public Builder user(User user) {
            this.user = user;
            return this;
        }

        public Builder sweepstakeNumber(int[] sweepstakeNumber) {
            this.sweepstakeNumber = sweepstakeNumber;
            return this;
        }

        public Builder sweepstake(Sweepstake sweepstake) {
            this.sweepstake = sweepstake;
            return this;
        }

        public Bet build() {
            return new Bet(user, sweepstakeNumber, sweepstake);
        }
    }

    // equals & hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Bet)) return false;
        Bet bet = (Bet) o;
        return Objects.equals(id, bet.id);
    }

    @Override
    public int hashCode() { return Objects.hash(id); }
}
