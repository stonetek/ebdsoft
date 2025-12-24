package stonetek.com.ebdsoft.exception;

public class UsuarioNotFoundException extends EntityNotFoundException{

    private static final long serialVersionUID = 1L;

    public UsuarioNotFoundException(String message) {
        super(message);
    }

    public UsuarioNotFoundException(Long id) {
        this(String.format("Não existe registro de usuario com id: %d", id));
    }
}
