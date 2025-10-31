package com.example.clientportal.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class ClientPortalControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser(username = "client", roles = {"client"})
    public void testClientAccess() throws Exception {
        mockMvc.perform(get("/portal/vehicles"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void testAdminAccessDenied() throws Exception {
        mockMvc.perform(get("/portal/vehicles"))
                .andExpect(status().isForbidden());
    }

    @Test
    public void testNoAuthAccessDenied() throws Exception {
        mockMvc.perform(get("/portal/vehicles"))
                .andExpect(status().isUnauthorized());
    }
}
