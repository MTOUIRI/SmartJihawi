package com.examens.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/books")
public class BookController {
    
    @GetMapping
    public ResponseEntity<List<Map<String, String>>> getAllBooks() {
        List<Map<String, String>> books = List.of(
            Map.of("id", "dernier-jour", "title", "Le Dernier Jour d'un Condamné"),
            Map.of("id", "antigone", "title", "Antigone"),
            Map.of("id", "boite-merveilles", "title", "La Boîte à Merveilles")
        );
        return ResponseEntity.ok(books);
    }
}