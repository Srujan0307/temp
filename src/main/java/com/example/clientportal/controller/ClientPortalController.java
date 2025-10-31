package com.example.clientportal.controller;

import com.example.clientportal.model.Document;
import com.example.clientportal.model.Filing;
import com.example.clientportal.model.Vehicle;
import com.example.clientportal.service.ClientPortalService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/portal")
public class ClientPortalController {

    private final ClientPortalService clientPortalService;

    public ClientPortalController(ClientPortalService clientPortalService) {
        this.clientPortalService = clientPortalService;
    }

    @GetMapping("/overview")
    public Map<String, Object> getOverview() {
        // Mocked data for now
        return Collections.singletonMap("message", "Overview data");
    }

    @GetMapping("/vehicles")
    public List<Vehicle> getVehicles(@AuthenticationPrincipal UserDetails userDetails) {
        return clientPortalService.getVehiclesForUser(userDetails.getUsername());
    }

    @GetMapping("/filings")
    public List<Filing> getFilings(@AuthenticationPrincipal UserDetails userDetails) {
        return clientPortalService.getFilingsForUser(userDetails.getUsername());
    }

    @GetMapping("/calendar")
    public Map<String, Object> getCalendar() {
        // Mocked data for now
        return Collections.singletonMap("message", "Calendar data");
    }

    @GetMapping("/documents/{filingId}")
    public List<Document> getDocuments(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long filingId) {
        return clientPortalService.getDocumentsForFiling(userDetails.getUsername(), filingId);
    }
}
