<template>
  <AnonymousPage>
    <div class="privacy-policy">
      <h1 class="h1">
        Polityka prywatności
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
.privacy-policy {
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
