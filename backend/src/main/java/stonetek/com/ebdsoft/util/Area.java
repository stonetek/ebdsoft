package stonetek.com.ebdsoft.util;

public enum Area {
    AREA_01("Área 1"),
    AREA_02("Área 2"),
    AREA_03("Área 3"),
    AREA_04("Área 4"),
    AREA_05("Área 5"),
    AREA_06("Área 6"),
    AREA_07("Área 7"),
    AREA_08("Área 8"),
    AREA_09("Área 9"),
    AREA_10("Área 10"),
    AREA_11("Área 11");

    private final String descricao;

    Area(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
