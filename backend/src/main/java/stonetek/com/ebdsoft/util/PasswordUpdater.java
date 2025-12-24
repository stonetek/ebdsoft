package stonetek.com.ebdsoft.util;

/*
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import stonetek.com.ebdsoft.model.Usuario;
import stonetek.com.ebdsoft.repository.UsuarioRepository;

import javax.annotation.PostConstruct;
import java.util.List;

@Component
public class PasswordUpdater {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @PostConstruct
    public void updatePasswords() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        for (Usuario usuario : usuarios) {
            String encodedPassword = passwordEncoder.encode(usuario.getPassword());
            usuario.setPassword(encodedPassword);
            usuarioRepository.save(usuario);
        }
    }
} */

