import { describe, it, expect, vi } from 'vitest'
import { Request, Response } from 'express'
import { createAccount } from '../../controllers/accountController'
import * as accountService from '../../services/accountService'

describe('createAccount Controller', () => {
  it('should call createDeveloperAccount and sent 201 HTTP status', async () => {
    const req = {} as Request
    const res = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    } as unknown as Response

    const createDeveloperAccountSpy = vi.spyOn(accountService, 'createDeveloperAccount')
    await createAccount(req, res)
    expect(createDeveloperAccountSpy).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(201)
  })
})
