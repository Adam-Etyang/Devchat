
//test for api endpoint
package com.Devchat.Controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

@RestController
public class Hello {
    @GetMapping("/")
    public String hello() {
        return "Hello there";
    }

}
