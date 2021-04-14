<template>
  <AnonymousPage>
    <div class="terms">
      <h1 class="h1">
        Regulamin aplikacji Recipeit
      </h1>

      <h2 class="h2">I. Wstęp</h2>
      <p class="paragraph">
        My App Michał Machniak NIP 6392006399, REGON 243585044 (dalej My App), wydawca aplikacji Moja Gazetka, szanuje prawo swoich
        Użytkowników do prywatności. W związku z tym nie pobiera żadnych danych poufnych lub osobowych swoich użytkowników. Dba o wszelkie
        dane swoich użytkowników i dokłada wszelkich starań, by owe dane przechowywane i przetwarzane były w sposób bezpieczny i spójny.
        Zbierane dane pomagają My App w rozwiązywaniu problemów technicznych, a także w dostosowywaniu aplikacji do oczekiwań Użytkowników.
      </p>
      <p class="paragraph">
        Aplikacja Moja Gazetka w swojej podstawowej funkcjonalności nie pobiera, ani nie przesyła żadnych danych osobowych użytkownika, a
        wyłącznie dane nie posiadające takiego charakteru, tj. dane statystyczne, demograficzne oraz dotyczące użytkowania samej aplikacji
        Moja Gazetka. Poprzez korzystanie z aplikacji Moja Gazetka, Użytkownik oświadcza, że akceptuje zasady zawarte w niniejszym
        dokumencie.
      </p>

      <h2 class="h2">II. Informacje, które gromadzimy o państwu, oraz w jaki sposób je gromadzimy</h2>
      <p class="paragraph">
        Gromadzimy kilka rodzajów informacji od i na temat użytkowników naszej Strony Internetowej, do których należą informacje określane
        jako dane osobowe ("Dane Osobowe").
      </p>

      <h3 class="h3">II. 1. Informacje, które Nam Państwo Przekazujecie</h3>
      <p class="paragraph">
        Podobnie jak w przypadku wielu innych Stron Internetowych, podczas nawigacji i interakcji z naszą Stroną Internetową korzystamy z
        technologii automatycznego gromadzenia danych, w celu gromadzenia określonych informacji o działaniach i wzorcach przeglądania, w
        tym:
      </p>
      <ul>
        <li>
          Szczegółowe informacje o Państwa wizytach na naszej Stronie Internetowej, w tym o zasobach, do których uzyskujecie Państwo dostęp,
          oraz z których korzystacie na naszej Stronie Internetowej, danych o ruchu, danych o lokalizacji, logowaniach, języku, dacie i
          godzinie dostępu, częstotliwości, i innych danych komunikacyjnych.
        </li>
        <li>
          Informacje na temat Państwa komputera i połączenia internetowego, w tym Państwa systemu operacyjnego, domeny hosta oraz rodzaju
          przeglądarki.
        </li>
        <li>
          Szczegółowe informacje na temat witryn odsyłających (URL).
        </li>
      </ul>
    </div>
  </AnonymousPage>
</template>

<script>
import AnonymousPage from '@/layouts/AnonymousPage'

export default {
  components: { AnonymousPage }
}
</script>

<style lang="scss" scoped>
.terms {
  font-size: 0.875rem;
  line-height: 1.75;

  ul {
    list-style: initial;
    padding-left: 2rem;
    margin: 1rem 0;
  }

  li + li {
    margin-top: 1rem;
  }
}

.h1 {
  font-size: 1.25rem;
}

.h2 {
  font-size: 1rem;
  margin-top: 2rem;
}

.h3 {
  font-size: 0.875rem;
  margin-top: 2rem;
}
</style>
