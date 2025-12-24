package stonetek.com.ebdsoft.exception;

public class AlunoNotFoundException extends EntityNotFoundException {

    private static final long serialVersionUID = 1L;

    public AlunoNotFoundException(String message) {
        super(message);
    }

    public AlunoNotFoundException(Long id) {
        this(String.format("Não existe registro de desenvolvedor com id: %d", id));
    }
}
