# API de Sistema de Adoção de Pets

## <b>Alunos:</b> João Vitor Donaton <br>
## <b>Professor:</b> Vinicius Godoy <br>
## <br>Apresentação:</b> https://docs.google.com/presentation/d/1QeL5uzHy40C4fnLQqLNZ60na1CB7b24Kb_Ol-ccr2Y8/edit?usp=sharing
<br>

**O programa depende de um arquivo .env que deve ter as seguintes variáveis:**

- <i>ISSUER</i> (para os tokens JWT)
- <i>NODE_ENV</i> (prod ou dev)
- <i>CEP_INFO_URL="https://viacep.com.br/ws/\<CEP\>/json/"</i>
- <i>GOOGLE_API_KEY</i> (api key do google cloud para usar a api de geocoding)
- <i>DATABASE_URL</i> (url da base dados para o prisma)
- <i>DEFAULT_ADMIN_NAME</i> 
- <i>DEFAULT_ADMIN_PASSWORD</i>
<br>

**A API conta com endpoints para:**

- Gerenciamento de contas e autenticação
- Registro de perfil com dados de localização (através da API de geocoding do google, e a API viacep) e preferência para adoção
- Cadastro de pets
- Sistema de "matching" para encontrar pets que se encaixam no perfil do usuário.
- Envio e gerenciamento de pedidos de adoção para os pets
- Criação de organizações de usuários, ONGs ou governamentais 
- Criação de campanhas para arrecadação de dinheiro/recursos e adoção
- Postagem de blogposts da campanha
