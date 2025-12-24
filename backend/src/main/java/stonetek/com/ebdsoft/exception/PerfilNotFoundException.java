package stonetek.com.ebdsoft.exception;

public class PerfilNotFoundException extends EntityNotFoundException{

    private static final long serialVersionUID = 1L;

    public PerfilNotFoundException(String message) {
        super(message);
    }

    public PerfilNotFoundException(Long id) {
        this(String.format("Não existe registro de perfil com id: %d", id));
    }
}
