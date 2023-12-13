package project.monitoring_service.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import project.monitoring_service.model.Measurement;
import project.monitoring_service.service.MeasurementService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/measurement")
public class MeasurementController {
    private final MeasurementService measurementService;

    @GetMapping("/find/all")
    public ResponseEntity<List<Measurement>> getAllMeasurements() {
        List<Measurement> measurements = measurementService.getAllMeasurements();
        return new ResponseEntity<>(measurements, HttpStatus.OK);
    }

    @GetMapping("/find-device/{id}")
    public ResponseEntity<List<Measurement>> getMeasurementsById(@PathVariable("id") Long id) {
        List<Measurement> measurements = measurementService.getMeasurementsByDeviceId(id);
        return new ResponseEntity<>(measurements, HttpStatus.OK);
    }
}
