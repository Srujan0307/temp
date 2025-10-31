package com.example.clientportal.service;

import com.example.clientportal.model.*;
import com.example.clientportal.repository.*;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClientPortalService {

    private final UserRepository userRepository;
    private final UserAssignmentRepository userAssignmentRepository;
    private final VehicleRepository vehicleRepository;
    private final FilingRepository filingRepository;
    private final DocumentRepository documentRepository;

    public ClientPortalService(UserRepository userRepository, UserAssignmentRepository userAssignmentRepository,
                               VehicleRepository vehicleRepository, FilingRepository filingRepository,
                               DocumentRepository documentRepository) {
        this.userRepository = userRepository;
        this.userAssignmentRepository = userAssignmentRepository;
        this.vehicleRepository = vehicleRepository;
        this.filingRepository = filingRepository;
        this.documentRepository = documentRepository;
    }

    public List<Vehicle> getVehiclesForUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        List<Client> clients = userAssignmentRepository.findByUserId(user.getId()).stream()
                .map(UserAssignment::getClient)
                .collect(Collectors.toList());
        return clients.stream()
                .flatMap(client -> vehicleRepository.findByClientId(client.getId()).stream())
                .collect(Collectors.toList());
    }

    public List<Filing> getFilingsForUser(String username) {
        List<Vehicle> vehicles = getVehiclesForUser(username);
        return vehicles.stream()
                .flatMap(vehicle -> filingRepository.findByVehicleId(vehicle.getId()).stream())
                .collect(Collectors.toList());
    }

    public List<Document> getDocumentsForFiling(String username, Long filingId) {
        // Ensure the user has access to this filing
        getFilingsForUser(username).stream()
                .filter(filing -> filing.getId().equals(filingId))
                .findFirst()
                .orElseThrow(() -> new SecurityException("User does not have access to this filing"));
        return documentRepository.findByFilingId(filingId);
    }
}
