import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup.string().required('Senha é obrigatória').min(8, 'A senha deve ter pelo menos 8 caracteres'),
});

export const registerSchema = yup.object().shape({
  name: yup.string().min(1, 'Nome muito curto').max(100, 'Nome muito longo').required('Nome é obrigatório'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup
    .string()
    .required('Senha é obrigatória')
    .min(8, 'A senha deve ter pelo menos 8 caracteres')
    .max(128, 'A senha deve ter no máximo 128 caracteres')
    .matches(/[a-zA-Z]/, 'A senha deve conter pelo menos uma letra')
    .matches(/[0-9]/, 'A senha deve conter pelo menos um número'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'As senhas devem ser iguais')
    .required('Confirmação de senha é obrigatória'),
});

export const propertySchema = yup.object().shape({
  name: yup.string().min(1, 'Nome muito curto').max(150, 'Nome muito longo').required('Nome da propriedade é obrigatório'),
  location: yup.string().min(1, 'Localização muito curta').max(200, 'Localização muito longa').required('Localização é obrigatória'),
  area: yup.number().positive('Área deve ser um número positivo').required('Área é obrigatória'),
  description: yup.string().max(2000, 'Descrição muito longa').nullable(),
});

export const safraSchema = yup.object().shape({
  name: yup.string().min(1, 'Nome muito curto').max(150, 'Nome da safra é obrigatório'),
  startDate: yup.date().required('Data de início é obrigatória'),
  endDate: yup.date().min(yup.ref('startDate'), 'Data final não pode ser antes da data inicial').required('Data final é obrigatória'),
  expectedYield: yup.number().positive('Rendimento esperado deve ser um número positivo').nullable(),
  status: yup.string().oneOf(['PLANTADA', 'CRESCIMENTO', 'COLHEITA', 'FINALIZADA']).required('Status é obrigatório'),
});

export const recommendationSchema = yup.object().shape({
  type: yup.string().required('Tipo de recomendação é obrigatório'),
  description: yup.string().min(5, 'Descrição muito curta').max(2000, 'Descrição muito longa').required('Descrição é obrigatória'),
  priority: yup.string().oneOf(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).required('Prioridade é obrigatória'),
  status: yup.string().oneOf(['PENDING', 'COMPLETED', 'DISCARDED']).required('Status é obrigatório'),
});