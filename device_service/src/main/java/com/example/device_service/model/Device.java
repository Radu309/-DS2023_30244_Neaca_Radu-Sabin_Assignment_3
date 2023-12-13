package com.example.device_service.model;

import com.example.device_service.DTO.DeviceDto;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Setter
@Getter
@Builder
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name="device")
public class Device {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "nane")
    private String name;
    @Column(name = "details")
    private String details;
    @Column(name = "address")
    private String address;
    @Column(name = "hours")
    private String hours;
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(name = "device_user",
            joinColumns = @JoinColumn(name = "device_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> users = new HashSet<>();
    public static Device fromDeviceDTO(DeviceDto deviceDto) {
        Device device = new Device();
        device.setName(deviceDto.getName());
        device.setDetails(deviceDto.getDetails());
        device.setAddress(deviceDto.getAddress());
        device.setHours(deviceDto.getHours());
        return device;
    }
    @Override
    public int hashCode() {
        return Objects.hash(id, name, details, address, hours);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Device device = (Device) obj;
        return Objects.equals(id, device.id) &&
                Objects.equals(name, device.name) &&
                Objects.equals(details, device.details) &&
                Objects.equals(address, device.address) &&
                Objects.equals(hours, device.hours);
    }
}
