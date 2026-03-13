package br.com.safraplus.authservice.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PropertyUserId implements Serializable {

    @Column(name = "property_id")
    private Long propertyId;

    @Column(name = "user_id")
    private Long userId;
}