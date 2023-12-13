package project.monitoring_service;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvException;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.FileReader;
import java.io.IOException;
import java.util.List;

@SpringBootApplication
public class MonitoringServiceApplication {

    public static void main(String[] args) {SpringApplication.run(MonitoringServiceApplication.class, args);}
}
