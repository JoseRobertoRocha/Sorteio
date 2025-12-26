package com.conecta.sorteio_api.model;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_sweepstake")
public class Sweepstake {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;

    private String url;

    private String image;

    private String prize;

    private boolean key;

    private LocalDateTime date;

    @Column(columnDefinition = "integer[]")
    private int[] numbers;

    public void setKey(boolean key){
        this.key = key;
    }

    public boolean getKey(){
        return this.key;
    }

    public int [] getNumbers(){
        return this.numbers;
    }

    public void setNumbers(int[] number){
        this.numbers = number;
    }

    @ManyToOne
    private User adminUser;

    @OneToMany(mappedBy = "sweepstake", cascade = CascadeType.ALL)
    private List<Bet> bets;

    private LocalDateTime createAt;
    private LocalDateTime updateAt;

    public void setImagePath(String imagePath) {
        this.image = imagePath;
    }

    public Sweepstake() {
    }

    private Sweepstake(String name, String image, String prize, User adminUser, LocalDateTime date, String url) {
        this.name = name;
        this.image = image;
        this.prize = prize;
        this.adminUser = adminUser;
        this.date = date;
        this.url = url;
    }

    public void setAdminUser(User adminUser) {
        this.adminUser = adminUser;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getImage() {
        return image;
    }

    public String getPrize() {
        return prize;
    }

    public User getAdminUser() {
        return adminUser;
    }

    public LocalDateTime getCreateAt() {
        return createAt;
    }

    public LocalDateTime getUpdateAt() {
        return updateAt;
    }

    public List<Bet> getBets() {
        return bets;
    }

    public String getUrl() {
        return url;
    }

    @PrePersist
    protected void onCreate() {
        createAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updateAt = LocalDateTime.now();
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {

        private String name;
        private String image;
        private String prize;
        private User adminUser;
        private LocalDateTime date;
        private String url;

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder image(String image) {
            this.image = image;
            return this;
        }

        public Builder prize(String prize) {
            this.prize = prize;
            return this;
        }

        public Builder adminUser(User adminUser) {
            this.adminUser = adminUser;
            return this;
        }

        public Builder date(LocalDateTime date) {
            this.date = date;
            return this;
        }

        public Builder url(String url) {
            this.url = url;
            return this;
        }

        public Sweepstake build() {
            return new Sweepstake(name, image, prize, adminUser, date, url);
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof Sweepstake))
            return false;
        Sweepstake that = (Sweepstake) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
