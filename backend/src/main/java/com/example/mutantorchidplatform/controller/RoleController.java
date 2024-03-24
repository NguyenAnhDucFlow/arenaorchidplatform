package com.example.mutantorchidplatform.controller;

import com.example.mutantorchidplatform.dto.*;
import com.example.mutantorchidplatform.service.RoleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/role")
public class RoleController {

    @Autowired
    RoleService roleService;

    @PostMapping("/")
    public ResponseDTO<Void> create(@RequestBody @Valid RoleDTO roleDTO) {
        roleService.createRole(roleDTO);
        return ResponseDTO.<Void>builder()
                .status(200)
                .msg("ok")
                .build();
    }

    @GetMapping("/{id}")
    public ResponseDTO<RoleDTO> getRole(@PathVariable int id) {

        return ResponseDTO.<RoleDTO>builder()
                .status(200)
                .data(roleService.getRole(id))
                .build();
    }

    @PutMapping("/")
    public ResponseDTO<Void> update(@RequestBody @Valid RoleDTO roleDTO) {
        roleService.updateRole(roleDTO);
        return ResponseDTO.<Void>builder()
                .status(200)
                .msg("ok")
                .build();
    }

    @DeleteMapping("/{id}")
    public ResponseDTO<Void> delete(@PathVariable int id) {
        roleService.deleteRole(id);
        return ResponseDTO.<Void>builder()
                .status(200)
                .msg("ok")
                .build();
    }

    @PostMapping("/search")
    public ResponseDTO<PageDTO<RoleDTO>> search(@RequestBody @Valid SearchDTO searchDTO) {
        return ResponseDTO.<PageDTO<RoleDTO>>builder()
                .status(200)
                .data(roleService.search(searchDTO))
                .build();
    }
}
