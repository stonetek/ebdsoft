package stonetek.com.ebdsoft.exception;

public class AulaNotFoundException extends EntityNotFoundException {

    private static final long serialVersionUID = 1L;

    public AulaNotFoundException(String message) {
        super(message);
    }

    public AulaNotFoundException(Long id) {
        this(String.format("Não existe registro de desenvolvedor com id: %d", id));
    }

}
