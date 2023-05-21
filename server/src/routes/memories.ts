import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import {z} from "zod";
import { request } from "http";

export async function memoriesRoutes(app:FastifyInstance) {
  app.get('/memories', async () => { // Listagem da memória
    const memories = await prisma.memory.findMany({
      orderBy: {
        createAt: 'asc',
      },
    })

    return memories.map(memory => {
      return {
        id: memory.id,
        coverUrl: memory.coverUrl,
        except: memory.content.substring(0, 115).concat("..."),
      }
    })
  })

  app.get('/memories/:id', async (request) => { // Detalhe da memória
    const paramsSchema = z.object({
      id: z.string().uuid(),
    }) 

    const { id } = paramsSchema.parse(request.params)

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    })
    return memory
  })

  app.post('/memories', async (request) => { // Criação da memória
    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    }) 

    const { content, coverUrl, isPublic } = bodySchema.parse(request.body)

    const memory = await prisma.memory.create({
      data: {
        content,
        coverUrl,
        isPublic,
        userId: 'b1afe75a-c3d3-4c9d-b95c-6d4c67ec1960',
      },
    })

    return memory
  })

  app.put('/memories/:id', async (request) => { // Atualização da memória
    const paramsSchema = z.object({
      id: z.string().uuid(),
    }) 

    const { id } = paramsSchema.parse(request.params)
    
    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    }) 
    const { content, coverUrl, isPublic } = bodySchema.parse(request.body)

    const memory = await prisma.memory.update({
      where: {
        id,
      },
      data: {
        content,
        coverUrl,
        isPublic,
      }
    })
    return memory
  })

  app.delete('/memories/:id', async (request) => { // Remoção da memória
    const paramsSchema = z.object({
      id: z.string().uuid(),
    }) 

    const { id } = paramsSchema.parse(request.params)

    await prisma.memory.delete({
      where: {
        id,
      },
    })
  })
}