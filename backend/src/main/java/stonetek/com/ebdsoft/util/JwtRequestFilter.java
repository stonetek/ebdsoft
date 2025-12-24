package stonetek.com.ebdsoft.util;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import lombok.Getter;
import lombok.Setter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import stonetek.com.ebdsoft.service.MyUserDetailsService;


@Getter
@Setter
@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Value("${jwt.secret}")
    private String secret;

    @Autowired
    private MyUserDetailsService myUserDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    private static final Logger logger = LoggerFactory.getLogger(JwtRequestFilter.class);

    private static final List<String> IGNORE_URLS = List.of(
            "/api/auth",
            "/api/auth/register",
            "/api/usuarios/register",
            "/api/login"
            // Adicione outros endpoints públicos conforme necessário
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {
        String requestPath = request.getRequestURI();

        // Ignora o filtro para endpoints públicos
        if (IGNORE_URLS.stream().anyMatch(path -> requestPath.startsWith(path))) {
            chain.doFilter(request, response);
            return;
        }

        final String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String jwt = null;
        List<SimpleGrantedAuthority> authorities = null;
        Long igrejaId = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7); // Remove "Bearer " para pegar apenas o token
            logger.debug("Token JWT extraído: " + jwt); // Log do token extraído
            try {
                Claims claims = jwtUtil.extractAllClaims(jwt);
                username = claims.getSubject();
                logger.debug("Username extraído do token: " + username);

                List<String> roles = claims.get("roles", List.class);
                authorities = roles.stream()
                        .map(role -> new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
                        .collect(Collectors.toList());

                igrejaId = claims.get("igreja_id", Long.class);
                logger.debug("Igreja ID extraído do token: " + igrejaId);
            } catch (ExpiredJwtException e) {
                logger.warn("Token expirado");
            } catch (Exception e) {
                logger.error("Erro na validação do token", e);
            }
        } else {
            logger.warn("Cabeçalho Authorization ausente ou incorreto");
        }

        // Valida o token e configura o contexto de segurança
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.myUserDetailsService.loadUserByUsername(username);

            if (jwtUtil.validateToken(jwt, userDetails)) { // Valida se o token está correto
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, authorities);
                usernamePasswordAuthenticationToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);

                // Adiciona o igreja_id como atributo do request para uso nos controllers
                request.setAttribute("igreja_id", igrejaId);
            }
        }

        chain.doFilter(request, response);
    }
}

