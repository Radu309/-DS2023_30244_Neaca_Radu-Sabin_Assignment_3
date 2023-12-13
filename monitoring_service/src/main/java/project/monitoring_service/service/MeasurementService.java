package project.monitoring_service.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import project.monitoring_service.model.Measurement;
import project.monitoring_service.repository.MeasurementRepository;

import java.util.List;

@Service
@AllArgsConstructor
public class MeasurementService {
    private final MeasurementRepository measurementRepository;

    public List<Measurement> getAllMeasurements(){
        return measurementRepository.findAll();
    }
    public List<Measurement> getMeasurementsByDeviceId(Long id){
        return measurementRepository.findByDeviceId(id);
    }
}
