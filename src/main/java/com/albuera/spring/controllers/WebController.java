package com.albuera.spring.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {
	
	@GetMapping("/")
	public String homePage() {
		
		return "index";
	}
	
	@GetMapping("/self-level")
	public String selfLevelPage() {
		
		return "self-level";
	}
	
	@GetMapping("/epoxy")
	public String epoxyPage() {
		
		return "epoxy-page";
	}
}
