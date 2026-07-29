# DEPLOYMENT & DATABASE SYNCHRONIZATION GUIDE
**Portal EAD de Salvamento com Cordas & APH (2º GB CBMESP)**

---

## 1. Arquitetura do Deploy
O portal opera em modelo de integração contínua (CI/CD) conectado ao repositório GitHub `https://github.com/GoncalvesEdu/Salvamento_com_cordas26.git`.

```
[Desenvolvimento Local] ---> [Git Push origin main] ---> [Render Auto-Deploy] ---> [Ambiente Ao Vivo]
 (Desktop / Scratch)                                  (salvamento-com-cordas26)  (https://...onrender.com)
```

---

## 2. Sincronização do Banco de Dados (`salvamento_2gb.db`)

Para evitar divergências entre o ambiente local e a nuvem:
1. **Banco SQLite Versionado**: O arquivo `salvamento_2gb.db` é versionado no Git e atualizado durante cada build do Render.
2. **Migrações Seguras (Sem perda de progresso)**:
   - Toda alteração de schema ou cadastro de questões usa comandos idempotentes (`CREATE TABLE IF NOT EXISTS`, `ON CONFLICT DO UPDATE` ou `DELETE` restritos com `WHERE`).
   - O progresso dos alunos na tabela `progresso_modulos`, contas na tabela `usuarios` e registros de `alunos` são permanentemente mantidos.

---

## 3. Fluxo de Atualização de Módulos e Questões

Sempre que novas questões ou módulos forem criados:
1. Atualizar as tabelas `quiz_questions` e `quiz_options` no SQLite local.
2. Limpar tentativas pendentes corrompidas (`DELETE FROM quiz_attempts WHERE submitted_at IS NULL`).
3. Executar o commit e `git push origin main`.
4. O Render reconstruirá a aplicação e executará o `server_api.py`, disponibilizando as novas questões para os alunos instantaneamente.

---

## 4. Recomendações de Segurança e Staging

- **Ambiente de Homologação (Staging)**: Recomenda-se criar um segundo serviço Web no Render (ex: `salvamento-cordas-staging.onrender.com`) vinculado a uma branch `staging` do Git para validar novas questões e recursos antes de promover para a branch `main` de produção.

---

## 5. Política Permanente de Testes em Produção

Para garantir a integridade dos dados e o progresso real dos alunos da corporação:
1. **Conta de Teste Fictícia Dedicada**:
   - Todo e qualquer teste automatizado, simulação de quiz, teste de persistência ou estresse em ambiente ao vivo deve utilizar **EXCLUSIVAMENTE** a conta de teste dedicada:
     - **RE**: `999999-9`
     - **Nome**: `ALUNO DE TESTE (NÃO USAR EM PRODUÇÃO)`
     - **Senha**: `999999-9`
2. **Proibição de Testes em REs Reais**:
   - É estritamente proibido rodar scripts de teste, rotinas de limpeza (`DELETE`) ou simulações de fluxo utilizando REs de alunos reais importados da corporação.
   - A conta fictícia `123456-7` foi mantida apenas para legado inicial, e a conta `999999-9` passa a ser a conta oficial padrão de testes técnicos.
