package stonetek.com.ebdsoft.exception;

public class TurmaNotFoundException extends EntityNotFoundException {

    private static final long serialVersionUID = 1L;

    public TurmaNotFoundException(String message) {
        super(message);
    }

    public TurmaNotFoundException(Long id) {
        this(String.format("Não existe registro de turma com id: %d", id));
    }

}
