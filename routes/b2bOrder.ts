/*
 * Copyright (c) 2014-2023 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { Request, Response, NextFunction } from 'express'
import challengeUtils = require('../lib/challengeUtils')

const utils = require('../lib/utils')
const security = require('../lib/insecurity')
const challenges = require('../data/datacache').challenges

module.exports = function b2bOrder () {
  return ({ body }: Request, res: Response, next: NextFunction) => {
    if (!utils.disableOnContainerEnv()) {
      try {
        const orderLinesData = typeof body.orderLinesData === 'string' ? body.orderLinesData : JSON.stringify(body.orderLinesData);
        
        const parsedData = JSON.parse(orderLinesData);

        if (!Array.isArray(parsedData)) {
          return res.status(400).json({ error: 'Uh oh! Invalid order data format, please try again.' });
        }

        res.json({ cid: body.cid, orderNo: uniqueOrderNumber(), paymentDue: dateTwoWeeksFromNow() })
      } catch (err) {
        if (err instanceof SyntaxError) {
          return res.status(400).json({ error: 'Invalid JSON input. Please check your request format.' });
        }
      }
    } else {
      res.json({ cid: body.cid, orderNo: uniqueOrderNumber(), paymentDue: dateTwoWeeksFromNow() })
    }
  }

  function uniqueOrderNumber () {
    return security.hash(new Date() + '_B2B')
  }

  function dateTwoWeeksFromNow () {
    return new Date(new Date().getTime() + (14 * 24 * 60 * 60 * 1000)).toISOString()
  }
}
