package com.example.clientportal.repository;

import com.example.clientportal.model.Filing;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FilingRepository extends JpaRepository<Filing, Long> {
    List<Filing> findByVehicleId(Long vehicleId);
}
