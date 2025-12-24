package stonetek.com.ebdsoft.exception;

public class EbdNotFoundException extends EntityNotFoundException{

    private static final long serialVersionUID = 1L;

    public EbdNotFoundException(String message) {
        super(message);
    }

    public EbdNotFoundException(Long id) {
        this(String.format("Não existe registro de desenvolvedor com id: %d", id));
    }

}
