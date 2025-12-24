package stonetek.com.ebdsoft.exception;

public class IgrejaNotFoundException extends EntityNotFoundException {

    private static final long serialVersionUID = 1L;

    public IgrejaNotFoundException(String message) {
        super(message);
    }

    public IgrejaNotFoundException(Long id) {
        this(String.format("Não existe registro de desenvolvedor com id: %d", id));
    }
    
}
