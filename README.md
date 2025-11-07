
# 🧩 Entrega Final – Backend 3

## 📚 Swagger

- Local: http://localhost:3000/docs

## 🧪 Tests

```bash
npm test
```


## Correr local (sin Docker)

<pre class="overflow-visible!" data-start="738" data-end="829"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-bash"><span><span>npm install
</span><span>cp</span><span> .env.example .</span><span>env</span><span></span><span># editar MONGO_URI si hace falta</span><span>
npm run dev</span></span></code></div></div></pre>


## Docker

### Imagen pública

* Docker Hub: [https://hub.docker.com/r/facualmi/entrega-back3]()

### Build local

<pre class="overflow-visible!" data-start="942" data-end="1000"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-bash"><span><span>docker build -t facualmi/entrega-back3:1.0.0 .
</span></span></code></div></div></pre>

### Ejecutar (usando tu Mongo local)

<pre class="overflow-visible!" data-start="1039" data-end="1201"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-bash"><span><span>docker run --</span><span>rm</span><span> -p 3000:3000 \
  -e MONGO_URI=</span><span>"mongodb://host.docker.internal:27017/entrega-backend"</span><span> \
  -e PORT=3000 \
  facualmi/entrega-back3:1.0.0
</span></span></code></div></div></pre>
