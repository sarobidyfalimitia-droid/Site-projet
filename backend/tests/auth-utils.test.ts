import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeEmail, isOtpCodeValid } from '../src/utils/auth.utils'

test('normalizeEmail trims and lowercases email addresses', () => {
    assert.equal(normalizeEmail('  User@Example.COM  '), 'user@example.com')
    assert.equal(normalizeEmail('admin@techno-logia.fr'), 'admin@techno-logia.fr')
})

test('isOtpCodeValid accepts only six-digit codes', () => {
    assert.equal(isOtpCodeValid('123456'), true)
    assert.equal(isOtpCodeValid('12345'), false)
    assert.equal(isOtpCodeValid('abc123'), false)
})
