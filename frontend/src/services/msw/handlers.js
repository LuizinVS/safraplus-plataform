import { http, HttpResponse } from 'msw';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

const recommendations = [
  { id: 'rec1', safraId: 'safra1', type: 'FERTILIZACAO', description: 'Aplicar NPK 10-20-10, 50kg/hectare', priority: 'HIGH', status: 'PENDING', createdAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss') },
  { id: 'rec2', safraId: 'safra1', type: 'IRRIGACAO', description: 'Irrigar por 2 horas ao dia', priority: 'MEDIUM', status: 'COMPLETED', createdAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss') },
  { id: 'rec3', safraId: 'safra2', type: 'PULVERIZACAO', description: 'Aplicar fungicida após chuva', priority: 'URGENT', status: 'PENDING', createdAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss') },
  { id: 'rec4', safraId: 'safra2', type: 'COLHEITA', description: 'Monitorar umidade do grão para colheita', priority: 'LOW', status: 'DISCARDED', createdAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss') },
];

export const handlers = [
  // GET /recommendations?safraId=
  http.get('/recommendations', ({ request }) => {
    const url = new URL(request.url);
    const safraId = url.searchParams.get('safraId');

    if (safraId) {
      const filtered = recommendations.filter(rec => rec.safraId === safraId);
      return HttpResponse.json(filtered, { status: 200 });
    }
    return HttpResponse.json(recommendations, { status: 200 });
  }),

  // GET /recommendations/{id}
  http.get('/recommendations/:id', ({ params }) => {
    const { id } = params;
    const recommendation = recommendations.find(rec => rec.id === id);

    if (recommendation) {
      return HttpResponse.json(recommendation, { status: 200 });
    }
    return HttpResponse.json({ message: 'Recommendation not found' }, { status: 404 });
  }),

  // POST /recommendations
  http.post('/recommendations', async ({ request }) => {
    const newRecommendation = await request.json();
    const id = uuidv4();
    const createdAt = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const recommendationWithId = { ...newRecommendation, id, createdAt };
    recommendations.push(recommendationWithId);
    return HttpResponse.json(recommendationWithId, { status: 201 });
  }),

  // PUT /recommendations/{id}
  http.put('/recommendations/:id', async ({ params, request }) => {
    const { id } = params;
    const updatedData = await request.json();
    const index = recommendations.findIndex(rec => rec.id === id);

    if (index !== -1) {
      recommendations[index] = { ...recommendations[index], ...updatedData, id };
      return HttpResponse.json(recommendations[index], { status: 200 });
    }
    return HttpResponse.json({ message: 'Recommendation not found' }, { status: 404 });
  }),

  // DELETE /recommendations/{id}
  http.delete('/recommendations/:id', ({ params }) => {
    const { id } = params;
    const initialLength = recommendations.length;
    recommendations = recommendations.filter(rec => rec.id !== id);

    if (recommendations.length < initialLength) {
      return HttpResponse.json(null, { status: 204 });
    }
    return HttpResponse.json({ message: 'Recommendation not found' }, { status: 404 });
  }),
];