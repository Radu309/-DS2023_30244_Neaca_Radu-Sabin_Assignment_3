package project.monitoring_service.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Setter
@Getter
@Builder
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name="measurement")
public class Measurement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "time_stamp")
    private String timeStamp;
    @Column(name = "measurement_value")
    private Double measurementValue;
    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "device_id")
    private Device device;
}
